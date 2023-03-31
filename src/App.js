import { useReducer } from "react";
import DigitalButton from "./DigitalButton";
import OperationButton from "./OperationButton";
import "./styles.css";

export const ACTIONS = {
    ADD_DIGIT: "add-digit",
    CHOOSE_OPERATION: "choose-operation",
    CLEAR: "clear",
    DELETE_DIGIT: "delete-digit",
    EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (StyleSheet.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false,
                };
            }
            if (payload.digit === "0" && state.currentOperand === "0")
                return state;
            if (payload.digit === "." && state.currentOperand.includes("."))
                return state;
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`,
            };

        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null)
                return state;
            if (StyleSheet.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null,
                };
            }
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                };
            }

            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null,
            };

        case ACTIONS.EVALUATE:
            if (
                state.operation == null ||
                state.currentOperand == null ||
                state.previousOperand == null
            )
                return state;
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
            };

        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null,
                };
            }
            if (state.currentOperand == null) return state;
            if (state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null,
                };
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1),
            };
        case ACTIONS.CLEAR:
            return {};
    }

    function evaluate({ currentOperand, previousOperand, operation }) {
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        if (isNaN(prev) || isNaN(current)) return "";
        let computation = "";
        switch (operation) {
            case "+":
                computation = prev + current;
                break;
            case "-":
                computation = prev - current;
                break;
            case "*":
                computation = prev * current;
                break;
            case "/":
                computation = prev / current;
                break;
        }
        return computation.toString();
    }
}

function App() {
    const [
        { currentOperand, previousOperand, operation },
        dispatch,
    ] = useReducer(reducer, {});

    return (
        <div className="calculator-grid">
            <div className="output">
                <div className="previous-operand">
                    {previousOperand} {operation}
                </div>
                <div className="current-operand"> {currentOperand}</div>
            </div>
            <button
                className="span-two"
                onClick={() => dispatch({ type: ACTIONS.CLEAR })}
            >
                AC
            </button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
                {" "}
                DEL
            </button>
            <OperationButton operation="/" dispatch={dispatch}>
                /
            </OperationButton>
            <DigitalButton digit="1" dispatch={dispatch}>
                1
            </DigitalButton>
            <DigitalButton digit="2" dispatch={dispatch}>
                2
            </DigitalButton>
            <DigitalButton digit="3" dispatch={dispatch}>
                3
            </DigitalButton>
            <OperationButton operation="*" dispatch={dispatch}>
                *
            </OperationButton>
            <DigitalButton digit="4" dispatch={dispatch}>
                4
            </DigitalButton>
            <DigitalButton digit="5" dispatch={dispatch}>
                5
            </DigitalButton>
            <DigitalButton digit="6" dispatch={dispatch}>
                6
            </DigitalButton>
            <OperationButton operation="+" dispatch={dispatch}>
                +
            </OperationButton>
            <DigitalButton digit="7" dispatch={dispatch}>
                7
            </DigitalButton>
            <DigitalButton digit="8" dispatch={dispatch}>
                8
            </DigitalButton>
            <DigitalButton digit="9" dispatch={dispatch}>
                9
            </DigitalButton>
            <OperationButton operation="-" dispatch={dispatch}>
                -
            </OperationButton>
            <DigitalButton digit="." dispatch={dispatch}>
                .
            </DigitalButton>
            <DigitalButton digit="0" dispatch={dispatch}>
                0
            </DigitalButton>
            <button
                className="span-two"
                onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
            >
                =
            </button>
        </div>
    );
}

export default App;
