interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps) {
  return (
    <div className="h-15 lg:w-6xl w-full flex items-center mx-auto py-4 lg:px-20 px-4">
      <h1 className="w-full text-2xl font-bold border-b border-gray-300">
        {title}
      </h1>
    </div>
  );
}

export default Title;
