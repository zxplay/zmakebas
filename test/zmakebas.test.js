// noinspection JSUnresolvedFunction

import * as assert from "assert";
import zmakebas from "../index.js";

function printErrorOut(errorItems) {
    for (let i = 0; i < errorItems.length; i++) {
        const item = errorItems[i];
        if (item.type === 'out') {
            console.log(`[stdout] ${item.text}`);
        } else {
            console.assert(item.type === 'err');
            console.log(`[stderr] ${item.text}`);
        }
    }
}

describe('zmakebas', () => {
    test('hello, world', () => {
        let bas = '';
        bas = bas + '10 PRINT "Hello, world!"\n';
        bas = bas + '20 GO TO 10';

        return zmakebas(bas).then(
            result => {
                expect(JSON.stringify(result)).toBe(
                    "{\"0\":19,\"1\":0,\"2\":0,\"3\":0,\"4\":32,\"5\":32,\"6\":32,\"7\":32,\"8\":32," +
                    "\"9\":32,\"10\":32,\"11\":32,\"12\":32,\"13\":32,\"14\":35,\"15\":0,\"16\":0,\"17\":0," +
                    "\"18\":35,\"19\":0,\"20\":0,\"21\":37,\"22\":0,\"23\":255,\"24\":0,\"25\":10,\"26\":17," +
                    "\"27\":0,\"28\":245,\"29\":34,\"30\":72,\"31\":101,\"32\":108,\"33\":108,\"34\":111,\"35\":44," +
                    "\"36\":32,\"37\":119,\"38\":111,\"39\":114,\"40\":108,\"41\":100,\"42\":33,\"43\":34,\"44\":13," +
                    "\"45\":0,\"46\":20,\"47\":10,\"48\":0,\"49\":236,\"50\":49,\"51\":48,\"52\":14,\"53\":0," +
                    "\"54\":0,\"55\":10,\"56\":0,\"57\":0,\"58\":13,\"59\":235}"
                );
            },
            error => {
                printErrorOut(error);
                assert.fail();
            }
        );
    });

    /*
    test('def fn', () => {
        let bas = '';
        bas = bas + '10 DEF FN a(b)=2*b\n';
        bas = bas + '20 PRINT FN a(2)';

        return zmakebas(bas).then(
            result => {
                // NOTE: The test comparison here is not yet useful as zmakebas produced a program that fails.
                expect(JSON.stringify(result)).toBe(
                    "{\"0\":19,\"1\":0,\"2\":0,\"3\":0,\"4\":32,\"5\":32,\"6\":32,\"7\":32,\"8\":32," +
                    "\"9\":32,\"10\":32,\"11\":32,\"12\":32,\"13\":32,\"14\":43,\"15\":0,\"16\":0,\"17\":0,\"18\":43," +
                    "\"19\":0,\"20\":0,\"21\":45,\"22\":0,\"23\":255,\"24\":0,\"25\":10,\"26\":22,\"27\":0," +
                    "\"28\":206,\"29\":97,\"30\":40,\"31\":98,\"32\":14,\"33\":0,\"34\":0,\"35\":0,\"36\":0,\"37\":0," +
                    "\"38\":41,\"39\":61,\"40\":50,\"41\":14,\"42\":0,\"43\":0,\"44\":2,\"45\":0,\"46\":0,\"47\":42," +
                    "\"48\":98,\"49\":13,\"50\":0,\"51\":20,\"52\":13,\"53\":0,\"54\":245,\"55\":168,\"56\":97,\"57\":40," +
                    "\"58\":50,\"59\":14,\"60\":0,\"61\":0,\"62\":2,\"63\":0,\"64\":0,\"65\":41,\"66\":13,\"67\":112}"
                );
            },
            error => {
                printErrorOut(error);
                assert.fail();
            }
        );
    });
    */

    test('labelsMode', () => {
        let bas = '';
        bas = bas + 'start print "Hello, world!"\n';
        bas = bas + 'go to start';

        return zmakebas(bas, true).then(
            result => {
                expect(JSON.stringify(result)).toBe(
                    "{\"0\":19,\"1\":0,\"2\":0,\"3\":0,\"4\":32,\"5\":32,\"6\":32,\"7\":32,\"8\":32," +
                    "\"9\":32,\"10\":32,\"11\":32,\"12\":32,\"13\":32,\"14\":37,\"15\":0,\"16\":0,\"17\":0," +
                    "\"18\":37,\"19\":0,\"20\":0,\"21\":39,\"22\":0,\"23\":255,\"24\":0,\"25\":10,\"26\":22," +
                    "\"27\":0,\"28\":115,\"29\":116,\"30\":97,\"31\":114,\"32\":116,\"33\":245,\"34\":34,\"35\":72," +
                    "\"36\":101,\"37\":108,\"38\":108,\"39\":111,\"40\":44,\"41\":32,\"42\":119,\"43\":111," +
                    "\"44\":114,\"45\":108,\"46\":100,\"47\":33,\"48\":34,\"49\":13,\"50\":0,\"51\":12,\"52\":7," +
                    "\"53\":0,\"54\":236,\"55\":115,\"56\":116,\"57\":97,\"58\":114,\"59\":116,\"60\":13,\"61\":252}"
                );
            },
            error => {
                printErrorOut(error);
                assert.fail();
            }
        );
    });

    test('error in program', () => {
        let bas = '';
        bas = bas + 'PRINT"\n';

        try {
            return zmakebas(bas).then(
                result => {
                    expect(JSON.stringify(result)).toBe("{}");
                    assert.fail(); // Expecting error here.
                },
                error => {
                    expect(error.length).toBe(1);
                    expect(error[0].type).toBe('err');
                    expect(error[0].text).toBe('line 1: missing line number');
                }
            );
        } catch (e) {
            console.error(e);
        }
    });
});
