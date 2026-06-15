'use client';

import { Card, CardContent } from '@/components/ui/card';
import useAccountMain from '@/hooks/admin/account/useAccountMain';
import AccountInfoColumn from '@/components/features/admin/account/AccountInfoColumn';
import ErrorModal from '@/components/features/admin/common/ErrorModal';

function AccountMain() {
  const {
    accountMeHooks,
    editAccountNameHooks,
    editUsernameHooks,
    editPasswordHooks,
    errorModalHooks,
  } = useAccountMain();
  return (
    <div className="h-full w-full lg:w-6xl flex flex-col mx-auto p-4 lg:px-0">
      <div className="h-full lg:w-200 w-full lg:mx-auto flex flex-col">
        <Card className="border-none shadow-none p-4">
          <CardContent className="my-2 flex flex-col gap-4">
            {/* アカウント名 */}
            <AccountInfoColumn
              label="アカウント名"
              value={accountMeHooks.accountName}
              editValue={editAccountNameHooks.editAccountName}
              placeholder="変更後のアカウント名"
              type="text"
              onEditChange={editAccountNameHooks.handleAccountNameChange}
              onEdit={editAccountNameHooks.handleAccountNameEdit}
              editFlag={editAccountNameHooks.editFlag}
              onSubmit={editAccountNameHooks.updateAccountName}
            />
            {/* ユーザー名 */}
            <AccountInfoColumn
              label="ユーザー名"
              value={accountMeHooks.username}
              editValue={editUsernameHooks.editUsername}
              placeholder="変更後のユーザー名"
              type="text"
              onEditChange={editUsernameHooks.handleUsernameChange}
              onEdit={editUsernameHooks.handleUsernameEdit}
              editFlag={editUsernameHooks.editFlag}
              onSubmit={() =>
                editUsernameHooks.changeEmail(accountMeHooks.username)
              }
              requiredPassword={true}
              passwordValue={editUsernameHooks.password}
              onPasswordChange={editUsernameHooks.handlePasswordChange}
            />
            {/* パスワード */}
            <AccountInfoColumn
              label="パスワード"
              value={''}
              editValue={editPasswordHooks.editPassword}
              confirmValue={editPasswordHooks.confirmPassword}
              placeholder="変更後のパスワード"
              type="password"
              onEditChange={editPasswordHooks.handlePasswordChange}
              onConfirmChange={editPasswordHooks.handleConfirmPasswordChange}
              onEdit={editPasswordHooks.handlePasswordEdit}
              editFlag={editPasswordHooks.editFlag}
              onSubmit={editPasswordHooks.changePassword}
              requiredPassword={true}
              passwordValue={editPasswordHooks.currentPassword}
              onPasswordChange={editPasswordHooks.handleCurrentPasswordChange}
            />
          </CardContent>
        </Card>
      </div>
      <ErrorModal
        isOpen={errorModalHooks.isOpen}
        errorMessage={errorModalHooks.errorMessage}
        onClose={errorModalHooks.onClose}
      />
    </div>
  );
}

export default AccountMain;
