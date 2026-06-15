import listIcon from '@/assets/images/list-icon.png';
import Image from 'next/image';

interface ListAreaProps {
  handleClickList: () => void;
}

function ListArea({ handleClickList }: ListAreaProps) {
  return (
    <div
      className="flex items-center justify-center w-full h-full mb-4"
      onClick={handleClickList}
    >
      <button className="hover:cursor-pointer hover:opacity-60 hover:scale-110 duration-200">
        <Image src={listIcon} alt="一覧" width={40} height={40} />
      </button>
    </div>
  );
}

export default ListArea;
