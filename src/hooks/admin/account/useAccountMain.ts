'use client';

import useErrorModal from '@/hooks/admin/common/useErrorModal';
import useAccountMe from '@/hooks/admin/account/useAccountMe';
import useEditAccountName from '@/hooks/admin/account/useEditAccountName';
import useEditUsername from '@/hooks/admin/account/useEditUsername';
import useEditPassword from '@/hooks/admin/account/useEditPassword';
import { MeResponse } from '@/types/api/account';

interface UseAccountMainProps {
  initialAccount: MeResponse;
}

function useAccountMain({ initialAccount }: UseAccountMainProps) {
  const errorModalHooks = useErrorModal();
  const accountMeHooks = useAccountMe({ initial: initialAccount });
  const editAccountNameHooks = useEditAccountName({
    showError: errorModalHooks.showError,
  });
  const editUsernameHooks = useEditUsername({
    showError: errorModalHooks.showError,
  });
  const editPasswordHooks = useEditPassword({
    showError: errorModalHooks.showError,
  });

  return {
    accountMeHooks,
    editAccountNameHooks,
    editUsernameHooks,
    editPasswordHooks,
    errorModalHooks,
  };
}

export default useAccountMain;
