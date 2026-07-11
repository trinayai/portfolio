import { z } from 'genkit';
export declare const ai: import("genkit").Genkit;
export declare const chatbotFlow: import("genkit").Action<z.ZodObject<{
    query: z.ZodString;
    history: z.ZodOptional<z.ZodArray<z.ZodObject<{
        role: z.ZodEnum<["user", "model"]>;
        content: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            text: string;
        }, {
            text: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        role: "model" | "user";
        content: {
            text: string;
        }[];
    }, {
        role: "model" | "user";
        content: {
            text: string;
        }[];
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    query: string;
    history?: {
        role: "model" | "user";
        content: {
            text: string;
        }[];
    }[] | undefined;
}, {
    query: string;
    history?: {
        role: "model" | "user";
        content: {
            text: string;
        }[];
    }[] | undefined;
}>, z.ZodString, z.ZodTypeAny, any, z.ZodTypeAny>;
export declare const chatbot: import("firebase-functions/https").CallableFunction<any, Promise<any>, any>;
//# sourceMappingURL=index.d.ts.map