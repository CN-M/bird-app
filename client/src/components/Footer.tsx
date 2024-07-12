export const Footer = () => {
  return (
    <footer className="bg-gray-800 p-4 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-white text-center">
          &copy; {new Date().getFullYear()} Task Taker. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
