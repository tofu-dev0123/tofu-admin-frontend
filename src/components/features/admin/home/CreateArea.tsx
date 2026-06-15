import Image from 'next/image';
import addIcon from '@/assets/images/add-icon.png';

interface CreateAreaProps {
  handleClickCreate: () => void;
}

function CreateArea({ handleClickCreate }: CreateAreaProps) {
  return (
    <div
      className="flex items-center justify-center w-full h-full mb-4"
      onClick={handleClickCreate}
    >
      <button className="hover:cursor-pointer hover:opacity-60 hover:scale-110 duration-200">
        <Image src={addIcon} alt="追加" width={40} height={40} />
      </button>
    </div>
  );
}

export default CreateArea;
