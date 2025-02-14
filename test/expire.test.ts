import dayjs from "dayjs";
import { isExpired } from "../src/utils";

describe('Test expireAt', () => {
    it('responds with a json message', () => {
        const pass = dayjs().add(-1, 'millisecond');
        const fur = dayjs().add(1, 'millisecond');

        expect(isExpired(pass.toISOString())).toBe(true)
        expect(isExpired(fur.toISOString())).toBe(false)
    });
});