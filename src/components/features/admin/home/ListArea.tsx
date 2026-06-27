import { List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ListAreaProps {
  handleClickList: () => void;
}

function ListArea({ handleClickList }: ListAreaProps) {
  return (
    <Button size="lg" variant="outline" onClick={handleClickList}>
      <List />
      投稿一覧
    </Button>
  );
}

export default ListArea;
