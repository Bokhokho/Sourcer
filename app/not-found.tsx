export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-24 h-24 text-indigo-600 dark:text-indigo-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737a1.125 1.125 0 0 0-.108 1.205c.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149a1.125 1.125 0 0 0-.93.78 1.125 1.125 0 0 0 .108 1.205l.527.737c.32.448.269 1.061-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.349-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.543-.56.94-1.109.94h-1.094c-.55 0-1.02-.397-1.11-.94l-.149-.894a1.125 1.125 0 0 0-.78-.93 1.125 1.125 0 0 0-1.205.108l-.737.527c-.448.32-1.061.269-1.45-.12l-.773-.773a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.349.273-.806.108-1.203-.165-.398-.505-.711-.929-.782l-.894-.149A1.125 1.125 0 0 1 2.75 12.09v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.383.929-.78.165-.398.142-.855-.108-1.205l-.527-.737a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.349.25.806.272 1.203.107.398-.165.71-.505.781-.929l.149-.894Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
      <h1 className="text-4xl font-bold">Oops!</h1>
      <p className="text-gray-600 dark:text-gray-400">We couldn’t find the page you’re looking for.</p>
      <a
        href="/dashboard"
        className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
      >
        Return to dashboard
      </a>
    </div>
  );
}