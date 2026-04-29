import { RouterProvider, useRouter } from './lib/router';
import { AuthProvider } from './lib/auth';
import Layout from './components/Layout';
import MemberPricing from './pages/MemberPricing';
import Portal from './pages/Portal';
import Questionnaires from './pages/Questionnaires';
import Home from './pages/Home';
import Treatments from './pages/Treatments';
import WeightLoss from './pages/WeightLoss';
import Hormone from './pages/Hormone';
import SexualWellness from './pages/SexualWellness';
import HairSkin from './pages/HairSkin';
import Membership from './pages/Membership';
import Programs from './pages/Programs';
import Results from './pages/Results';
import Learn from './pages/Learn';
import Founder from './pages/Founder';
import Consultation from './pages/Consultation';
import Intake from './pages/Intake';
import ThankYou from './pages/ThankYou';
import Login from './pages/Login';
import Quiz from './pages/Quiz';
import Admin from './pages/Admin';
import NewsletterConfirm from './pages/NewsletterConfirm';
import NewsletterUnsubscribe from './pages/NewsletterUnsubscribe';
import Book from './pages/Book';
import BookManage from './pages/BookManage';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';

function Routes() {
  const { path } = useRouter();
  const base = path.split('?')[0];
  switch (base) {
    case '/': return <Home />;
    case '/treatments': return <Treatments />;
    case '/weight-loss': return <WeightLoss />;
    case '/hormone': return <Hormone />;
    case '/sexual-wellness': return <SexualWellness />;
    case '/hair-skin': return <HairSkin />;
    case '/membership': return <Membership />;
    case '/programs': return <Programs />;
    case '/results': return <Results />;
    case '/learn': return <Learn />;
    case '/founder': return <Founder />;
    case '/consultation': return <Consultation />;
    case '/intake': return <Intake />;
    case '/questionnaires': return <Questionnaires />;
    case '/thank-you': return <ThankYou />;
    case '/login': return <Login />;
    case '/quiz': return <Quiz />;
    case '/member/pricing': return <MemberPricing />;
    case '/portal':
    case '/portal/profile':
    case '/portal/cart':
    case '/portal/messages':
    case '/portal/documents':
      return <Portal />;
    case '/admin': return <Admin />;
    case '/book': return <Book />;
    case '/book/manage': return <BookManage />;
    case '/terms': return <Terms />;
    case '/privacy': return <Privacy />;
    case '/disclaimer': return <Disclaimer />;
    case '/newsletter/confirm': return <NewsletterConfirm />;
    case '/newsletter/unsubscribe': return <NewsletterUnsubscribe />;
    default: return <Home />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <Layout>
          <Routes />
        </Layout>
      </RouterProvider>
    </AuthProvider>
  );
}
