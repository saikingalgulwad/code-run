"use client";

import { useState } from "react";
import Link from "next/link";

export default function About() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (feedbackText.trim() === "") return;
    setFeedbacks([...feedbacks, feedbackText.trim()]);
    setFeedbackText("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-12">
      <div className="container mx-auto flex flex-col items-center">
        
        {/* Go Back Home Button */}
        <Link
          href="/"
          className="self-start mb-6 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
        >
          ← Go Back Home
        </Link>

        {/* Profile Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <img
            src="/image.jpeg" // Replace with your profile image path
            alt="Saiprasad Algulwad"
            className="w-36 h-36 rounded-full border-4 border-indigo-500 object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-indigo-400 mb-2">Saiprasad Algulwad</h1>
            <p className="text-lg mb-2">Full Stack Developer | Next.js & React Expert</p>
            <p className="text-gray-300 max-w-md">
              I specialize in creating fast, modern, and user-friendly web applications. 
              My goal is to deliver clean, maintainable code and intuitive digital experiences.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <h2 className="text-2xl font-semibold mt-4 mb-4 text-indigo-400">Tech Stack</h2>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React</li>
          <li>Next.js</li>
          <li>Node.js</li>
          <li>Express</li>
          <li>MongoDB</li>
          <li>Tailwind CSS</li>
        </ul>

        {/* Projects */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-400">Projects</h2>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>
            <Link
              href="https://manga-tau-nine.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Manga Reading App
            </Link>
          </li>
          <li>
            <Link
              href="https://marathi-rap.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Marathi Rap Website
            </Link>
          </li>
          <li>
            <Link
              href="https://ladakibahin.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Ladakibahin
            </Link>
          </li>
          <li>
            <Link
              href="https://saikingnext.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Pinterest Clone
            </Link>
          </li>
          <li>
            <Link
              href="https://video-call-zeta-nine.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Zoom Clone
            </Link>
          </li>
          <li>
            <Link
              href="https://next-js-app-eight-brown.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              ToDo List
            </Link>
          </li>
        </ul>

        {/* Resume */}
        <div className="mt-6 mb-10">
          <a
            href="https://portfolio-saiprasad.vercel.app/resume.pdf"
            className="inline-block bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Resume (PDF)
          </a>
        </div>

        {/* Feedback Section */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-indigo-400">Leave Your Feedback</h2>
        <form onSubmit={handleSubmit} className="mb-6 w-full max-w-xl">
          <textarea
            className="w-full p-3 border rounded-md mb-2 border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
            rows="4"
            placeholder="Share your feedback about my projects..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Submit Feedback
          </button>
        </form>

        {feedbacks.length > 0 && (
          <div className="mt-6 w-full max-w-xl">
            <h3 className="text-xl font-semibold mb-2 text-indigo-400">Feedbacks</h3>
            <ul className="list-disc pl-6 space-y-1">
              {feedbacks.map((fb, index) => (
                <li
                  key={index}
                  className="bg-gray-800 p-2 rounded-md border border-gray-700"
                >
                  {fb}
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
}
