declare module 'firebase/auth' {
  interface User {
    role: string | undefined;
  }
}