import { useRouter } from 'next/navigation';

function Logo() {
  const router = useRouter();

  const handleClickLogo = () => {
    router.push('/admin/home');
  };

  return (
    <div className="w-full flex items-center cursor-pointer gap-4 p-2">
      <h1
        className="text-2xl font-bold cursor-pointer"
        onClick={handleClickLogo}
      >
        Tofu Blog
      </h1>
    </div>
  );
}

export default Logo;
