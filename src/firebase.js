import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAkwpCWulJzzbEypxnCW-SJzNfeXaCEvJE",
  authDomain: "claude-test-project-d2b26.firebaseapp.com",
  projectId: "claude-test-project-d2b26",
  storageBucket: "claude-test-project-d2b26.firebasestorage.app",
  messagingSenderId: "749744902390",
  appId: "1:749744902390:web:82d7bcd217227e36615cd7",
  measurementId: "G-1PVJXVTFPQ"
}

const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export default app
