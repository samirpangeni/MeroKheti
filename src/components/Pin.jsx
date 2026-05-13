import React from 'react'

import { useState, useEffect, useRef } from "react";
const number_length = 4;
const Pin = () => {
    const [number, setNumber] = useState(["", "", "", ""]);

    const inputRefs = useRef([]);

    function q(value, index) {
        if (!/^\d*$/.test(value)) return;
        const newNumber = [...number];
        newNumber[index] = value;
        setNumber(newNumber);

        if (value && index < number_length - 1) {
            inputRefs.current[index + 1].focus();
        }
    }
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (number[index]) {
                const newNumber = [...number];
                newNumber[index] = "";
                setNumber(newNumber);
            } else if (index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    const handelKeyWord = (num) => {
        const index = number.findIndex((v) => v === "");
        if (index === -1) return;
        const newNumber = [...number];
        newNumber[index] = num;
        setNumber(newNumber);
        if (index < number_length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const finalNumber = number.join("");
        if (finalNumber === "0213") {
            return (
                <div>
                    <h1>hello it me </h1>
                </div>
            )
        } else {
            alert("Incorrect, try again!");
        }

    };
    return (
        <div className="flex flex-col w-full ">
            <form onSubmit={handleSubmit}>
                <div className="flex  gap-2 mb-3">
                    {number.map((value, index) => {
                        return (
                            <input
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                value={value}
                                key={index}
                                className="w-full border-2 border-white outline-none rounded-lg p-2 text-center"
                                onChange={(e) => {
                                    q(e.target.value, index);
                                }}
                                onKeyDown={(e) => {
                                    handleKeyDown(e, index);
                                }}
                                maxLength={1}
                            />
                        );
                    })}
                </div>
                <div className="grid grid-cols-3 gap-3 w-full text-center items-center justify-center">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => {
                        return (
                            <button
                                key={num}
                                type="button"
                                className="border-2 border-white rounded-lg p-2"
                                onClick={() => handelKeyWord(num)}
                            >
                                {num}
                            </button>
                        );
                    })}
                </div>
                <button
                    type="submit"
                    className="p-2 border-2 rounded-lg border-gray-500 bg-gray-600 flex items-center text-center justify-center mt-2"
                >
                    submit
                </button>
            </form>
        </div>
    );
};

export default Pin
