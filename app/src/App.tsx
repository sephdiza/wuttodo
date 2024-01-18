import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
} from '@clerk/clerk-react';
import Todo from './Todo';

function App() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <SignOutButton />
        <Todo />
      </SignedIn>
    </div>
  );
}

export default App;
