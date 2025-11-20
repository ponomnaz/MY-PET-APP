const MainContent = () => {
  return (
    <main className="flex-1 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Добро пожаловать!
        </h2>
        <p className="text-gray-600 mb-4">
           Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam facilisis orci eget eros aliquam ultrices. Nunc sagittis elit a tortor auctor tempor. Integer dui tortor, luctus vitae dictum nec, laoreet a orci. Integer scelerisque lectus sed neque vulputate, nec ornare ex placerat. Vestibulum luctus lorem vel ex efficitur dapibus. In scelerisque urna libero, a interdum dolor vehicula eu. Proin ac rutrum odio.

Phasellus mattis ipsum et imperdiet pretium. Donec laoreet facilisis libero, a blandit arcu luctus in. Donec euismod, felis at faucibus cursus, ligula erat sagittis felis, non fringilla enim libero vel tellus. Sed nec diam nunc. Ut nec lorem leo. Nam sed enim non risus scelerisque pellentesque eu vel dui. Morbi in venenatis dui. Curabitur tempor tristique nunc, at rhoncus lorem auctor sit amet. Duis cursus mollis blandit. Nulla facilisi. 
        </p>
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Особенности:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li>Скрываемая боковая панель</li>
          </ul>
        </div>
      </div>
    </main>
  );
};

export default MainContent;