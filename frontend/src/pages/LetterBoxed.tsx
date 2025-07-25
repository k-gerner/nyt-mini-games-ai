import React, { useState, useRef } from 'react';
import '../App.css'

const TOP = "top";
const RIGHT = "right";
const BOTTOM = "bottom";
const LEFT = "left";

type Side = typeof TOP | typeof RIGHT | typeof BOTTOM | typeof LEFT;
type LetterSides = {
    [key in Side]: string[];
};

const buttonStyle = "rounded-full border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-teal hover:border-teal focus-visible:text-white focus-visible:bg-dark-teal focus-visible:border-teal active:border-dark-teal active:text-white active:bg-dark-teal disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none";
const maxWordCountPickerButtonStyle = "py-2 px-4 inline-flex items-center gap-x-2 first:rounded-s-lg first:ms-0 last:rounded-e-lg border border-gray-200 hover:bg-teal text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-teal hover:border-teal focus:text-white focus:bg-dark-teal focus:border-teal active:border-dark-teal active:text-white active:bg-dark-teal";

const LetterBoxed = () => {
    const [solutions, setSolutions] = React.useState<string[]>([]);
    const [maxSolutionLength, setMaxSolutionLength] = useState<number>(2);
    const [letterSides, setLetterSides] = useState<LetterSides>({
        top: [],
        right: [],
        bottom: [],
        left: [],
    });
    const [invalidInputSide, setInvalidInputSide] = useState<Side | undefined>();
    const [pageNumber, setPageNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const lettersInputRefs: React.RefObject<HTMLInputElement | null>[] = [useRef(null), useRef(null), useRef(null), useRef(null)];
    const handleSolve = async () => {
        setLoading(true);
        const res = await fetch('http://localhost:5001/api/letter_boxed', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                letter_sides: [
                    ...Object.values(letterSides),
                ],
                max_solutions_length: maxSolutionLength
            })
        });

        const data = await res.json();
        setLoading(false);
        const solutions: string[] = []
        data.solutions.forEach((solution: string[]) => {
            solutions.push(solution.join(','));
        })
        setSolutions(solutions);
        setPageNumber(0);
    };

    const triggerInvalidInputAnimation = (side: Side) => {
        setInvalidInputSide(side);
        setTimeout(() => setInvalidInputSide(undefined), 200); // Reset after animation
    }

    const onLettersChange = (value: string, side: Side) => {
        const allExistingLetters = new Set(
            Object.entries(letterSides)
                .filter(([key]) => key !== side)
                .flatMap(([, letters]) => letters)
        );
        const currentSideLetters = Array.from(
            new Set(
                value
                    .toUpperCase()
                    .replace(/[^A-Z]/g, '')
                    .split('')
                    .slice(0, 3)
            )
        ).filter(letter => !allExistingLetters.has(letter));
        if (currentSideLetters.length < value.length) {
            triggerInvalidInputAnimation(side);
        }
        const newLetters = { ...letterSides, [side]: currentSideLetters };
        setLetterSides(newLetters);

        // Automatically move focus to the next input box when the current box is full
        if (currentSideLetters.length === 3) {
            const sides = Object.keys(letterSides) as Side[];
            const currentIndex = sides.indexOf(side);
            if (currentIndex < sides.length - 1) {
                lettersInputRefs[currentIndex + 1]?.current?.focus();
            }
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold text-dark-teal mb-4">Letter Boxed!</h1>
            <InputSection
                letters={letterSides}
                onLettersChange={onLettersChange}
                onSolve={handleSolve}
                lettersInputRefs={lettersInputRefs}
                invalidInputSide={invalidInputSide}
                maxSolutionLength={maxSolutionLength}
                setMaxSolutionLength={setMaxSolutionLength}
            />
            <div className="flex flex-col md:flex-row transition-all duration-300 ease-in-out w-full">
                <div className={`flex-shrink-0 transition-all duration-500 w-full ${solutions.length ? 'md:w-3/5' : 'md:w-full'}`}>
                    <LetterBox letterSides={letterSides} />
                </div>
                {solutions.length > 0 && (
                    <div className="w-full md:w-2/5 transition-all duration-300">
                        <AnswersSection
                            solutions={solutions}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            isLoading={loading}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

interface LetterBoxProps {
    letterSides: LetterSides;
}

const LetterBox: React.FC<LetterBoxProps> = ({ letterSides }) => {
    return (
        <div className="flex justify-center items-center font-mono py-14">
            <div className="min-w-max relative w-64 h-64 border-4 border-black flex justify-center items-center">
                {/* Top Circles */}
                <div className="absolute top-[-22%] left-[16%] flex justify-between w-2/3">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={`top-${index}`} className="flex flex-col items-center">
                            <span className="text-3xl mb-1">{letterSides[TOP][index] ?? '-'}</span>
                            <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-white"></div>
                        </div>
                    ))}
                </div>

                {/* Right Circles */}
                <div className="absolute right-[-18%] top-[16%] flex flex-col justify-between h-2/3">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={`right-${index}`} className="flex flex-row items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-white"></div>
                            <span className="text-3xl ml-3">{letterSides[RIGHT][index] ?? '-'}</span>
                        </div>
                    ))}
                </div>

                {/* Bottom Circles */}
                <div className="absolute bottom-[-22%] left-[16%] flex justify-between w-2/3">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={`bottom-${index}`} className="flex flex-col items-center">
                            <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-white"></div>
                            <span className="text-3xl mt-1">{letterSides[BOTTOM][index] ?? '-'}</span>
                        </div>
                    ))}
                </div>

                {/* Left Circles */}
                <div className="absolute left-[-18%] top-[16%] flex flex-col justify-between h-2/3">
                    {Array(3).fill(null).map((_, index) => (
                        <div key={`left-${index}`} className="flex flex-row items-center">
                            <span className="text-3xl mr-3">{letterSides[LEFT][index] ?? '-'}</span>
                            <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-white"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface InputSectionProps {
    letters: LetterSides;
    onLettersChange: (value: string, side: Side) => void;
    onSolve: () => void;
    lettersInputRefs: React.RefObject<HTMLInputElement | null>[];
    invalidInputSide: Side | undefined;
    maxSolutionLength: number;
    setMaxSolutionLength: (length: number) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
    letters,
    onLettersChange,
    onSolve,
    lettersInputRefs,
    invalidInputSide,
    maxSolutionLength,
    setMaxSolutionLength,
}) => {
    return (
        <div className="flex flex-col gap-4">
            <LettersInputs
                letters={letters}
                onLettersChange={onLettersChange}
                lettersInputRefs={lettersInputRefs}
                invalidInputSide={invalidInputSide}
            />
            <MaxWordSolutionLengthPicker
                maxSolutionLength={maxSolutionLength}
                setMaxSolutionLength={setMaxSolutionLength}
            />
            <div className="flex justify-center">
                <button
                    disabled={!Object.values(letters).every((side) => side.length === 3)}
                    onClick={onSolve}
                    className={`${buttonStyle} w-48`}
                >Solve</button>
            </div>
        </div>
    );
}


interface MaxWordSolutionLengthPickerProps {
    maxSolutionLength: number;
    setMaxSolutionLength: (length: number) => void;
}

const MaxWordSolutionLengthPicker: React.FC<MaxWordSolutionLengthPickerProps> = ({
    maxSolutionLength,
    setMaxSolutionLength
}) => {
    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <div>
                {[2, 3, 4, 5].map((value) => (
                    <button
                        key={value}
                        type="button"
                        className={`${maxWordCountPickerButtonStyle} ${maxSolutionLength === value
                            ? 'bg-dark-teal text-white'
                            : 'bg-white text-gray-800'}
                        `}
                        onClick={() => setMaxSolutionLength(value)}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <span className="text-sm text-slate-600">Max Words Per Solution</span>
        </div>
    );
}


interface LettersInputsProps {
    letters: LetterSides;
    onLettersChange: (value: string, side: Side) => void;
    lettersInputRefs: React.RefObject<HTMLInputElement | null>[];
    invalidInputSide: Side | undefined;
}

const LettersInputs: React.FC<LettersInputsProps> = ({
    letters,
    onLettersChange,
    lettersInputRefs,
    invalidInputSide
}) => {
    return (
        <div className='flex flex-wrap flex-row gap-2 justify-center'>
            <input
                type="text"
                value={letters[TOP].join('')}
                onChange={(e) => onLettersChange(e.target.value, TOP)}
                maxLength={3}
                placeholder="Top"
                className={`input-letter-box ${invalidInputSide === TOP ? 'shake' : ''} w-36 bg-transparent placeholder:text-slate-400 text-slate-800 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal hover:border-sky-blue shadow-sm focus:shadow`}
                ref={lettersInputRefs[0]}
            />
            <input
                type="text"
                value={letters[RIGHT].join('')}
                onChange={(e) => onLettersChange(e.target.value, RIGHT)}
                maxLength={3}
                placeholder="Right"
                className={`input-letter-box ${invalidInputSide === RIGHT ? 'shake' : ''} w-36 bg-transparent placeholder:text-slate-400 text-slate-800 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal hover:border-sky-blue shadow-sm focus:shadow`}
                ref={lettersInputRefs[1]}
            />
            <input
                type="text"
                value={letters[BOTTOM].join('')}
                onChange={(e) => onLettersChange(e.target.value, BOTTOM)}
                maxLength={3}
                placeholder="Bottom"
                className={`input-letter-box ${invalidInputSide === BOTTOM ? 'shake' : ''} w-36 bg-transparent placeholder:text-slate-400 text-slate-800 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal hover:border-sky-blue shadow-sm focus:shadow`}
                ref={lettersInputRefs[2]}
            />
            <input
                type="text"
                value={letters[LEFT].join('')}
                onChange={(e) => onLettersChange(e.target.value, LEFT)}
                maxLength={3}
                placeholder="Left"
                className={`input-letter-box ${invalidInputSide === LEFT ? 'shake' : ''} w-36 bg-transparent placeholder:text-slate-400 text-slate-800 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal hover:border-sky-blue shadow-sm focus:shadow`}
                ref={lettersInputRefs[3]}
            />
        </div>
    )
}


interface AnswersSectionProps {
    solutions: string[];
    pageNumber: number;
    setPageNumber: (page: number) => void;
    isLoading: boolean;
}

const AnswersSection: React.FC<AnswersSectionProps> = ({ solutions, pageNumber, setPageNumber, isLoading }) => {
    return (
        <div className="min-w-max flex flex-col w-full border-2 border:black rounded items-center">
            <h2 className="rounded text-lg font-bold text-center p-2 bg-dark-teal text-white w-full">
                {isLoading ? "Checking..." : `Potential Solutions (${solutions.length})`}
            </h2>
            {isLoading
                ? (
                    <div className="p-10">
                        <LoadingSpinner />
                    </div>
                ) : (solutions.length > 0
                    ? <>
                        <div className="w-full gap-4 flex flex-col px-2 py-4 justify-start items-center">
                            {solutions[pageNumber].split(',').map((word: any, index) => (
                                <div className="flex items-center">
                                    <div className="font-bold rounded-s-lg bg-teal text-white text-center py-4 pl-6 pr-2">{index + 1}</div>
                                    <div className="font-bold rounded-e-lg  bg-teal p-4 text-white min-w-max text-center tracking-widest">
                                        {word.toUpperCase()}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full flex flex-row py-2 px-6 gap-6">
                            <button
                                disabled={pageNumber === 0}
                                onClick={() => setPageNumber(pageNumber - 1)}
                                className={`${buttonStyle} w-full`}
                            >{"< Previous"}</button>
                            <button
                                disabled={pageNumber === solutions.length - 1}
                                onClick={() => setPageNumber(pageNumber + 1)}
                                className={`${buttonStyle} w-full`}
                            >{"Next >"}</button>
                        </div>
                    </>
                    : <span className="text-xl text-slate-600 p-10">No solutions found!</span>
                )
            }
        </div>
    );
}

const LoadingSpinner: React.FC = () => {
    return (
        <div role="status">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin fill-dark-teal" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    )
}

export default LetterBoxed;