type GameplayType = import('zod').infer<typeof import('@utils/zod/gameplay').GameplayTypes>;
type GameplayTypeWithNull = GameplayType | null;
