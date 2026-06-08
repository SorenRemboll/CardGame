-- Run this once to rename player1/player2 to attacker/defender on existing MySQL DB.
-- If you use `prisma db push` on a fresh DB, you don't need this.

ALTER TABLE `Game`
  RENAME COLUMN `player1Id` TO `attackerId`,
  RENAME COLUMN `player2Id` TO `defenderId`,
  RENAME COLUMN `player1DeckId` TO `attackerDeckId`,
  RENAME COLUMN `player2DeckId` TO `defenderDeckId`,
  RENAME COLUMN `player1Health` TO `attackerHealth`,
  RENAME COLUMN `player2Health` TO `defenderHealth`,
  RENAME COLUMN `player1MaxHealth` TO `attackerMaxHealth`,
  RENAME COLUMN `player2MaxHealth` TO `defenderMaxHealth`;
