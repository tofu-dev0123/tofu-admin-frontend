import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AccountInfoColumnProps {
  label: string;
  value: string;
  editValue: string;
  confirmValue?: string;
  placeholder: string;
  type: string;
  onEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSubmit: () => void;
  editFlag: boolean;
  requiredPassword?: boolean;
  passwordValue?: string;
  onPasswordChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function AccountInfoColumn({
  label,
  value,
  editValue,
  confirmValue,
  placeholder,
  type,
  onEditChange,
  onConfirmChange,
  onEdit,
  editFlag,
  onSubmit,
  requiredPassword = false,
  passwordValue,
  onPasswordChange,
}: AccountInfoColumnProps) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label className="block font-bold text-lg">{label}</Label>
        <div className="flex flex-col p-2 border-b border-gray-300 gap-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-gray-500">{value}</p>
            <Button
              className="h-8 w-25 py-0 cursor-pointer shadow-none"
              variant="outline"
              onClick={onEdit}
            >
              {editFlag ? 'キャンセル' : '編集'}
            </Button>
          </div>
          {editFlag && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-end justify-between gap-2 w-full">
                <div className="flex flex-col flex-1 gap-2 w-full">
                  <Label className="block font-bold">新しい{label}</Label>
                  <Input
                    className="w-full text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                    value={editValue}
                    type={type}
                    placeholder={placeholder}
                    onChange={onEditChange}
                    autoComplete="off"
                  />
                  {type === 'password' && (
                    <Input
                      className="w-full text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                      value={confirmValue}
                      type="password"
                      placeholder="確認用パスワード"
                      onChange={onConfirmChange}
                      autoComplete="off"
                    />
                  )}
                  {requiredPassword && (
                    <div className="flex flex-col justify-between gap-2 w-full mt-2">
                      <Label className="block font-bold">
                        現在のパスワードを入力
                      </Label>
                      <Input
                        className="w-full text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                        value={passwordValue}
                        type="password"
                        placeholder="現在のパスワード"
                        onChange={onPasswordChange}
                        autoComplete="off"
                      />
                    </div>
                  )}
                </div>
                <Button
                  className="h-8 w-25 py-0 cursor-pointer shadow-none"
                  onClick={onSubmit}
                >
                  変更
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

export default AccountInfoColumn;
