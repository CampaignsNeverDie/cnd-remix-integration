import { useRef } from 'react';
import { Form, useActionData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import { auth } from '~/auth.server';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import type { AppError } from '~/util';
import { users } from '~/controllers.server';

export const meta = () => {
  return {
    title: 'Sign Up Page',
  };
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();

    // TODO: implement proper form validation
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const confirm = form.get('confirm') as string;

    // TODO: form validation
    if (!email || email.trim() === '') {
      return json<AppError>(
        {
          status: 'validationFailure',
          errorCode: 'signup/invalid-email',
          errorMessage: 'Email field cannot be empty',
        },
        { status: 400 }
      );
    }

    if (!password || !confirm || password.trim() === '' || password !== confirm) {
      return json<AppError>(
        {
          status: 'validationFailure',
          errorCode: 'signup/invalid-password',
          errorMessage: 'Password fields cannot be empty and must match',
        },
        { status: 400 }
      );
    }

    // TODO: CSRF check

    // Create the account
    const res = await (await auth.createAccount({ username: email, password }) as Response).json();
    // Create the user in the database
    await users.create({ id: res.user.uid, role: 'guest', username: res.user.email, preferences: { theme: 'dark' } });
    // Redirect to the home/login page
    return redirect('/');
  } catch (error) {
    console.error('signup/general', `Could not create the account - ${error}`);
    return json<AppError>(
      {
        status: 'error',
        errorCode: 'signup/general',
        errorMessage: 'There was a problem creating the account',
      },
      { status: 500 }
    );
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  // redirect if already signed in
  if (await auth.user(request)) {
    return redirect('/');
  } else {
    return null;
  }
};

export default function Index() {
  const actionError = useActionData() as AppError | null;
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  return (
    <div className="remix__page">
      <main>
        <h2>Sign Up Page</h2>
        <p>Everyone can view the home page.</p>

        <section>
          <Form className="remix__form" method="post">
            <h3>Sign Up Form</h3>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" name="email" ref={emailRef} />
            <br />
            <label htmlFor="email">Password:</label>
            <input type="password" id="password" name="password" ref={passwordRef} />
            <br />
            <label htmlFor="email">Confirm Password:</label>
            <input type="password" id="confirm" name="confirm" ref={confirmRef} />
            <br />
            <button type="submit">Sign Up</button>
            {actionError?.errorCode && (
              <p>
                <em>Sign up failed: {actionError.errorMessage}</em>
              </p>
            )}
          </Form>
        </section>
      </main>
    </div>
  );
}
