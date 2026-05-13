import React from 'react'

const Indicator = ({ isValid, getValidationMessage, completionPercentage }) => {
    return (
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-2 h-2 rounded-full ${isValid ? "bg-green-500" : "bg-yellow-500"} animate-pulse`}
                    ></div>
                    <span className="text-sm text-gray-300">
                        {isValid
                            ? "✓ All set! Product ready to list"
                            : getValidationMessage()}
                    </span>
                </div>
                <span className="text-xs text-gray-400">
                    {completionPercentage}%
                </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                    className="bg-linear-to-r from-green-500 to-blue-500 h-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                ></div>
            </div>
        </div>
    )
}

export default Indicator
