import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CreateAreaProps {
  handleClickCreate: () => void;
}

function CreateArea({ handleClickCreate }: CreateAreaProps) {
  return (
    <Button size="lg" onClick={handleClickCreate}>
      <Plus />
      ブログを書く
    </Button>
  );
}

export default CreateArea;
