"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CodeBracketIcon,
  CubeIcon,
  ServerStackIcon,
  BeakerIcon,
  ArchiveBoxIcon,
  PencilSquareIcon,
  ComputerDesktopIcon,
  BoltIcon,
  RocketLaunchIcon,
  ServerIcon,
} from "@heroicons/react/24/solid";

export default function About() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [repos, setRepos] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("api/feedback");
      const data = await res.json();
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRepos = async () => {
    try {
      const res = await fetch(
        "https://api.github.com/users/saikingalgulwad/repos?sort=updated"
      );
      const data = await res.json();
      setRepos(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    fetchRepos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    try {
      const res = await fetch("api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feedbackText }),
      });
      if (res.ok) {
        const newFeedback = await res.json();
        setFeedbacks([newFeedback, ...feedbacks]);
        setFeedbackText("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Tech stack with proper Heroicons
  const techStack = [
    { name: "HTML", icon: <CodeBracketIcon className="h-5 w-5 text-orange-500" /> },
    { name: "CSS", icon: <CubeIcon className="h-5 w-5 text-blue-500" /> },
    { name: "JavaScript", icon: <BoltIcon className="h-5 w-5 text-yellow-400" /> },
    { name: "React", icon: <RocketLaunchIcon className="h-5 w-5 text-cyan-400" /> },
    { name: "Next.js", icon: <ComputerDesktopIcon className="h-5 w-5 text-gray-200" /> },
    { name: "Node.js", icon: <ServerIcon className="h-5 w-5 text-green-500" /> },
    { name: "Express", icon: <ServerStackIcon className="h-5 w-5 text-gray-300" /> },
    { name: "MongoDB", icon: <ArchiveBoxIcon className="h-5 w-5 text-green-600" /> },
    { name: "Tailwind CSS", icon: <CubeIcon className="h-5 w-5 text-teal-400" /> },
    { name: "Java", icon: <BeakerIcon className="h-5 w-5 text-red-500" /> },
  ];

  const languageColors = {
    JavaScript: "text-yellow-400",
    TypeScript: "text-blue-400",
    Python: "text-green-400",
    HTML: "text-orange-500",
    CSS: "text-blue-500",
    Java: "text-red-500",
    Shell: "text-gray-400",
    Go: "text-teal-400",
    default: "text-gray-300",
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 py-12">
      <div className="container mx-auto flex flex-col items-center">

        <Link
          href="/"
          className="self-start mb-6 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded transition"
        >
          ← Go Back Home
        </Link>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <img
            src="/image.jpeg"
            alt="Saiprasad Algulwad"
            className="w-36 h-36 rounded-full border-4 border-indigo-500 object-cover"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-indigo-400 mb-2">Saiprasad Algulwad</h1>
            <p className="text-lg mb-2">Full Stack Developer | Next.js & React Expert</p>
            <p className="text-gray-300 max-w-md">
              I specialize in creating fast, modern, and user-friendly web applications.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <h2 className="text-2xl font-semibold mt-4 mb-4 text-indigo-400">Tech Stack</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
          {techStack.map((tech) => (
            <li
              key={tech.name}
              className="bg-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 transition transform hover:scale-105 hover:bg-gray-700 cursor-pointer"
              title={tech.name}
            >
              {tech.icon}
              <span>{tech.name}</span>
            </li>
          ))}
        </ul>

        {/* Projects */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-400">Projects</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {repos.map((repo) => (
            <li
              key={repo.id}
              className="bg-gray-800 p-3 rounded-md border border-gray-700 hover:border-indigo-500 transition transform hover:scale-105 flex flex-col gap-2 cursor-pointer"
              title={repo.name}
            >
              <div className="flex items-center gap-2">
                <PencilSquareIcon
                  className={`h-5 w-5 ${
                    languageColors[repo.language] || languageColors.default
                  }`}
                />
                <Link
                  href={repo.html_url}
                  target="_blank"
                  className="text-blue-400 hover:underline"
                >
                  {repo.name}
                </Link>
              </div>
              {repo.description && <p className="text-gray-300 text-sm">{repo.description}</p>}
              {repo.language && (
                <span className="text-xs text-gray-400">Language: {repo.language}</span>
              )}
            </li>
          ))}
        </ul>

        <a
          href="https://portfolio-saiprasad.vercel.app/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 transition mb-10"
        >
          Download Resume (PDF)
        </a>

        {/* Feedback Section */}
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-indigo-400">Leave Your Feedback</h2>
        <form onSubmit={handleSubmit} className="mb-6 w-full max-w-xl flex flex-col gap-2">
          <textarea
            rows={4}
            placeholder="Share your feedback about my projects..."
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            className="w-full p-3 border rounded-md border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-100"
          />
          <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
            Submit Feedback
          </button>
        </form>

        {feedbacks.length > 0 && (
          <div className="mt-6 w-full max-w-xl space-y-2">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="bg-gray-800 p-3 rounded-md border border-gray-700">
                <p>{fb.text}</p>
                <span className="text-xs text-gray-400">{new Date(fb.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
