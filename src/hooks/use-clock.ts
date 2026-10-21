/* 棋钟钩子：挂在 GameView。
 * 职责：每 250ms 核对行棋方的总剩余与单步剩余，
 *     任一耗尽即调用 applyTimeout 判负（四人局为出局，由引擎决定）。
 * AI 思考期间其时钟照走（公平起见），AI 计算快不会超时；
 * 四人局本地 AI 席位不耗钟，故跳过对其计时。
 * 超时后由 VictoryOverlay 呈现「超时判负 / 出局」结算。
 */

"use client";

import { useEffect } from "react";
import { useQuoridor, isSeatAi, totalMsOf } from "@/store/game-store";
import { isTimed } from "@/lib/game/types";

export function useClockWatch(active: boolean) {
  const applyTimeout = useQuoridor((s) => s.applyTimeout);

  useEffect(() => {
    if (!active) return;

    const id = setInterval(() => {
      const { state, meta, config, seatConfig } = useQuoridor.getState();
      if (!state || state.winner) return;
      const tc = config.timeControl;
      if (!isTimed(tc)) return;
      if (meta.replayIndex != null) return;

      const p = state.turn;
      /* 四人局本地 AI 席位：不计时 */
      if (state.playerCount === 4 && isSeatAi(seatConfig, p)) return;
      const elapsed = Date.now() - meta.turnStartedAt;
      const usedTotal = totalMsOf(meta, p) + elapsed;
      if (
        (tc.totalSec > 0 && usedTotal >= tc.totalSec * 1000) ||
        (tc.perMoveSec > 0 && elapsed >= tc.perMoveSec * 1000)
      ) {
        applyTimeout(p);
      }
    }, 250);
    return () => clearInterval(id);
  }, [active, applyTimeout]);
}
