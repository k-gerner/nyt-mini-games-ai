import React, { useState } from 'react';

const Home = () => {
    const [input, setInput] = useState('');
    const [solution, setSolution] = useState('');

    const handleSolve = async () => {
        const res = await fetch('http://localhost:5001/api/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ puzzle: input })
        });

        const data = await res.json();
        setSolution(data.solution);
    };

    return (
        <div className="">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">NYT Game Solver</h1>
            <div className='flex flex-row gap-2 align-middle'>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Enter puzzle input"
                    style={{ width: '300px', marginRight: '10px' }}
                    className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-purple-500 hover:border-purple-300 shadow-sm focus:shadow"
                />
                <button
                    onClick={handleSolve}
                    className="rounded-full border border-slate-300 py-2 px-4 text-center text-sm transition-all shadow-sm hover:shadow-lg text-slate-600 hover:text-white hover:bg-slate-800 hover:border-slate-800 focus:text-white focus:bg-slate-800 focus:border-slate-800 active:border-slate-800 active:text-white active:bg-slate-800 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                >Solve</button>
            </div>
            <p><strong>Solution:</strong> {solution}</p>
        </div>
    );
}

export default Home;