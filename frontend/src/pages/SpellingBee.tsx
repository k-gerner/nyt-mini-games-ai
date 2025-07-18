import React, { useState } from 'react';
import '../App.css'

const WORDS_PER_PAGE = 5;
const buttonStyle = "rounded-full border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-teal hover:border-teal focus-visible:text-white focus-visible:bg-dark-teal focus-visible:border-teal active:border-dark-teal active:text-white active:bg-dark-teal disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"

const SpellingBee = () => {
    const [centerLetter, setCenterLetter] = useState('');
    const [outerLetters, setOuterLetters] = useState('');
    const [solution, setSolution] = useState('');
    const [pageNumber, setPageNumber] = useState(0);

    const handleSolve = async () => {
        const res = await fetch('http://localhost:5001/api/spelling_bee', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                center_letter: centerLetter,
                outer_letters: outerLetters.split('')
            })
        });

        const data = await res.json();
        setSolution(data.words.join(', '));
        setPageNumber(0);
    };

    const handleCenterLetterChange = (input: any) => {
        const val = input.target.value.toUpperCase().replace(/[^A-Z]/g, '');;
        setCenterLetter(val);
    }
    const handleOuterLettersChange = (input: any) => {
        const val = input.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        const uniqueLetters = Array.from(new Set(val.split(''))).join('');
        setOuterLetters(uniqueLetters);
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-center text-3xl font-bold text-dark-teal mb-4">Spelling Bee!</h1>
            <InputSection
                centerLetter={centerLetter}
                outerLetters={outerLetters}
                onCenterLetterChange={handleCenterLetterChange}
                onOuterLettersChange={handleOuterLettersChange}
                onSolve={handleSolve}
            />
            <div className="flex flex-col md:flex-row transition-all duration-300 ease-in-out">
                <div className={`flex-shrink-0 transition-all duration-500 w-full ${solution ? 'md:w-3/5' : 'md:w-full'}`}>
                    <LettersSection centerLetter={centerLetter} outerLetters={outerLetters.split('')} />
                </div>
                {solution && (
                    <div className="w-full md:w-2/5 transition-all duration-300">
                        <AnswersSection words={solution.split(', ')} pageNumber={pageNumber} setPageNumber={setPageNumber} />
                    </div>
                )}
            </div>
        </div>
    );
}

interface InputSectionProps {
    centerLetter: string;
    outerLetters: string;
    onCenterLetterChange: (value: any) => void;
    onOuterLettersChange: (value: any) => void;
    onSolve: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
    centerLetter,
    outerLetters,
    onCenterLetterChange,
    onOuterLettersChange,
    onSolve
}) => {
    return (
        <div className="flex flex-col gap-2">
            <div className='flex flex-row gap-2 justify-center'>
                <input
                    type="text"
                    value={centerLetter}
                    onChange={onCenterLetterChange}
                    maxLength={1}
                    placeholder="Center Letter"
                    className="w-36 bg-transparent placeholder:text-slate-400 text-slate-800 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal hover:border-sky-blue shadow-sm focus:shadow"
                />
                <input
                    type="text"
                    value={outerLetters}
                    onChange={onOuterLettersChange}
                    maxLength={6}
                    placeholder="Outer Letters"
                    className="w-36 bg-transparent placeholder:text-slate-400 text-slate-800 text-sm border-2 border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-teal hover:border-sky-blue shadow-sm focus:shadow"
                />
            </div>
            <div className="flex justify-center">
                <button
                    disabled={!centerLetter || outerLetters.length !== 6}
                    onClick={onSolve}
                    className={`${buttonStyle} w-48`}
                >Solve</button>
            </div>
        </div>
    );
}

interface LettersSectionProps {
    centerLetter: string;
    outerLetters: string[];
}

const LettersSection: React.FC<LettersSectionProps> = ({ centerLetter, outerLetters }) => {
    return (
        <div className="flex flex-row items-center p-6 justify-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-4">
                <Letter letter={outerLetters[0] || ''} />
                <Letter letter={outerLetters[1] || ''} />
            </div>
            <div className="flex flex-col items-center gap-4">
                <Letter letter={outerLetters[2] || ''} />
                <Letter letter={centerLetter || ''} isCenter={true} />
                <Letter letter={outerLetters[3] || ''} />
            </div>
            <div className="flex flex-col items-center gap-4">
                <Letter letter={outerLetters[4] || ''} />
                <Letter letter={outerLetters[5] || ''} />
            </div>
        </div>
    );
};

interface LetterProps {
    letter: string;
    isCenter?: boolean;
}

const Letter: React.FC<LetterProps> = ({ letter, isCenter }) => {
    const background = isCenter ? 'bg-my-yellow' : 'bg-gray-200';
    return (
        <div className={`hex ${background} flex items-center justify-center w-20 sm:w-24 md:w-28 lg:w-32 xl:w-40 transition-all duration-300`}>
            <span className="text-2xl bg-transparent text-black px-3 py-1 rounded">
                {letter}
            </span>
        </div>
    );
}

interface AnswersSectionProps {
    words: string[];
    pageNumber: number;
    setPageNumber: (page: number) => void;
}

const AnswersSection: React.FC<AnswersSectionProps> = ({ words, pageNumber, setPageNumber }) => {
    return (
        <div className="min-w-max flex flex-col w-full border-2 border:black rounded">
            <h2 className="rounded text-lg font-bold text-center p-2 bg-dark-teal text-white">
                {`Potential Words (${words.length})`}
            </h2>
            <div className="w-full gap-4 flex flex-col items-center justify-center px-2 py-4 ">
                {words.slice(pageNumber * WORDS_PER_PAGE, Math.min((pageNumber + 1) * WORDS_PER_PAGE, words.length)).map((word, index) => (
                    <div className="font-bold rounded bg-teal p-4 text-white min-w-max w-1/3 text-center tracking-widest">
                        {word.toUpperCase()}
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
                    disabled={pageNumber === Math.ceil(words.length / WORDS_PER_PAGE) - 1}
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className={`${buttonStyle} w-full`}
                >{"Next >"}</button>
            </div>
        </div>
    );
}

export default SpellingBee;