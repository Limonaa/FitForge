const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="h-6 bg-blue-950 rounded-t-2xl relative flex items-center justify-center px-4">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-white" />
            <div className="h-2 w-2 rounded-full bg-white" />
            <div className="h-2 w-2 rounded-full bg-white" />
          </div>
        </div>
        <div className="p-8 text-center">
          <p className="text-5xl font-bold mb-4">404</p>
          <p className="text-xl text-gray-600">Page not found</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
