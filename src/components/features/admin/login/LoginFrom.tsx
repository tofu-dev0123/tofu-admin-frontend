'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import loginIcon from '@/assets/images/login-icon.png';
import useLoginForm from '@/hooks/admin/login/useLoginForm';
import { MESSAGES } from '@/constants/messages';
import ErrorMessage from '@/components/features/admin/common/ErrorMessage';
import { Spinner } from '@/components/ui/spinner';

function LoginFrom() {
  const { formHook, onSubmit, errorMessage, isLoading } = useLoginForm();

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center flex-1">
          <Spinner className="w-10 h-10 text-white" />
        </div>
      ) : (
        <div className="flex justify-center items-center flex-1">
          <Card className="w-100 bg-gray-100/50 mx-10">
            <div className="flex justify-center items-center my-16">
              <Image
                src={loginIcon}
                alt="login icon"
                width={100}
                height={100}
              />
            </div>
            {errorMessage.length > 0 && (
              <ErrorMessage errorMessage={errorMessage} />
            )}
            <form onSubmit={onSubmit}>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    className="border-white bg-white rounded-full"
                    {...formHook.register('username', {
                      required: MESSAGES.validation.username.required,
                      maxLength: {
                        value: 50,
                        message: MESSAGES.validation.username.maxLength,
                      },
                    })}
                  />
                  {formHook.formState.errors.username?.message && (
                    <div className="h-7 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p>{formHook.formState.errors.username.message}</p>
                    </div>
                  )}
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    className="border-white bg-white rounded-full"
                    {...formHook.register('password', {
                      required: MESSAGES.validation.password.required,
                      minLength: {
                        value: 8,
                        message: MESSAGES.validation.password.minLength,
                      },
                      maxLength: {
                        value: 20,
                        message: MESSAGES.validation.password.maxLength,
                      },
                    })}
                  />
                  {formHook.formState.errors.password?.message && (
                    <div className="h-7 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <p>{formHook.formState.errors.password.message}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col">
                <Button
                  type="submit"
                  className="w-full rounded-full cursor-pointer"
                >
                  Login
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

export default LoginFrom;
