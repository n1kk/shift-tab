import { multiline, shiftTab, untag } from "../src";
import chalkTemplate from "chalk-template";

describe("multiline", () => {
    it("should join lines", () => {
        const text = multiline("line1", "line2");
        expect(text).toBe("line1\nline2");
    });
    it("should join array of lines", () => {
        const text = multiline(["line1", "line2"]);
        expect(text).toBe("line1\nline2");
    });
});

describe("shift-tab", () => {
    it("should remove indent", () => {
        const untabbed = shiftTab`                test`;
        const expected = `test`;
        expect(untabbed).toBe(expected);
    });

    it("should work multiline", () => {
        const untabbed = shiftTab`            test
            test2`;
        const expected = multiline([
            "test", //
            "test2",
        ]);
        expect(untabbed).toBe(expected);
    });

    it("should ignore empty lines", () => {
        const untabbed = shiftTab`
            test

            test2
        `;
        const expected = multiline([
            "test", //
            "",
            "test2",
        ]);
        expect(untabbed).toBe(expected);
    });

    it("should ignore empty lines with indent", () => {
        const untabbed = shiftTab`
            test
            
            test2
        `;
        const expected = multiline([
            "test", //
            "",
            "test2",
        ]);
        expect(untabbed).toBe(expected);
    });

    it("should remove smallest indent", () => {
        const untabbed = shiftTab`
            test
                test2
        `;
        const expected = multiline([
            "test", //
            "    test2",
        ]);
        expect(untabbed).toBe(expected);
    });

    it("should work with tabs tabs", () => {
        const untabbed = shiftTab`
\t\t\ttest
\t\t\t\ttest2
`;
        const expected = multiline([
            "test", //
            "\ttest2",
        ]);
        expect(untabbed).toBe(expected);
    });
    describe("should pick first encountered indent char", () => {
        it("space", () => {
            const untabbed = shiftTab`
            \ttest
              \t\ttest2
            `;
            const expected = multiline([
                "\ttest", //
                "  \t\ttest2",
            ]);
            expect(untabbed).toBe(expected);
        });

        it("tab", () => {
            const untabbed = shiftTab`
\t  test
\t\ttest2
`;
            const expected = multiline([
                "  test", //
                "\ttest2",
            ]);
            expect(untabbed).toBe(expected);
        });
    });

    describe("config", () => {
        describe("indent", () => {
            it("should unindent by first indentation", () => {
                const untabbed = shiftTab({ indent: "first" })`
                        test
                    test2
                        test3
                `;
                const expected = multiline([
                    "test", //
                    "test2",
                    "test3",
                ]);
                expect(untabbed).toBe(expected);
            });

            it("should unindent by minimum size", () => {
                const untabbed = shiftTab({ indent: "smallest" })`
                        test
                    test2
                        test3
                `;
                const expected = multiline([
                    "    test", //
                    "test2",
                    "    test3",
                ]);
                expect(untabbed).toBe(expected);
            });

            it("should unindent all", () => {
                const untabbed = shiftTab({ indent: "all" })`
                    test
                        test2
                        test3
                `;
                const expected = multiline([
                    "test", //
                    "test2",
                    "test3",
                ]);
                expect(untabbed).toBe(expected);
            });

            describe("should unindent to a number by minimum indent line", () => {
                it("spaces", () => {
                    const untabbed = shiftTab({ indent: 4 })`
                            test
                        test2
                            test3
                    `;
                    const expected = multiline([
                        "        test", //
                        "    test2",
                        "        test3",
                    ]);
                    expect(untabbed).toBe(expected);
                });

                it("tabs", () => {
                    const untabbed = shiftTab({ indent: 2 })`
\t\t\t\t\t\ttest
\t\t\t\t\ttest2
\t\t\t\t\t\ttest3
`;
                    const expected = multiline([
                        "\t\t\ttest", //
                        "\t\ttest2",
                        "\t\t\ttest3",
                    ]);
                    expect(untabbed).toBe(expected);
                });
            });
        });

        describe("trimEmpty", () => {
            it("should trim wrapping lines of the template", () => {
                const untabbed = shiftTab({ trim: "wrap" })`
                    test
                        test2
                `;
                const expected = multiline(
                    "test", //
                    "    test2",
                );
                expect(untabbed).toBe(expected);
            });

            it("should trim all empty leading and trailing lines", () => {
                const untabbed = shiftTab({ trim: "lines", indent: "smallest" })`
                            
                            test
                        test2
                            test3
                            
                            
                `;
                const expected = multiline([
                    "    test", //
                    "test2",
                    "    test3",
                ]);

                expect(untabbed).toBe(expected);
            });
        });

        describe("process", () => {
            it("should process result", () => {
                const process = (input: string) => input.toUpperCase();
                const untab = shiftTab({ process: [process] });

                const untabbed = untab`
                    test
                        test2
                `;
                const expected = multiline([
                    "TEST", //
                    "    TEST2",
                ]);
                expect(untabbed).toBe(expected);
            });

            it("should process with several in order", () => {
                const process1 = (input: string) => input.toUpperCase();
                const process2 = (input: string) => input.replace(/TEST/gi, "----");

                const untab = shiftTab({ process: [process1, process2] });

                const untabbed = untab`
                    testline
                        testline2
                `;
                const expected = multiline([
                    "----LINE", //
                    "    ----LINE2",
                ]);
                expect(untabbed).toBe(expected);
            });

            it("should should ignore processor output if it returns not string", () => {
                const colorize = untag(chalkTemplate);
                const log = console.log as (input: string) => string;

                const untab = shiftTab({ process: [colorize, log] });

                const untabbed = untab`
                    {red test}
                        {blue test2}
                `;
                const expected = multiline([
                    "[31mtest[39m", //
                    "    [34mtest2[39m",
                ]);
                expect(untabbed).toBe(expected);
            });
        });
    });

    it("should work with template with variables", () => {
        let undef = undefined;
        const untabbed = shiftTab`
            ${"test"}
                ${"test2"}
                ${undef}
        `;
        const expected = multiline([
            `${"test"}`, //
            `    ${"test2"}`,
            `    ${undef}`,
        ]);
        expect(untabbed).toBe(expected);
    });

    it("should work as a method", () => {
        let undef = undefined;
        const untabbed = shiftTab(`
            ${"test"}
                ${"test2"}
                ${undef}
        `);
        const expected = multiline([
            `${"test"}`, //
            `    ${"test2"}`,
            `    ${undef}`,
        ]);
        expect(untabbed).toBe(expected);
    });
});
