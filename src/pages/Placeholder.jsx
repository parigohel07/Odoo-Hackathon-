import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import PageContainer from '../components/layout/PageContainer'
import EmptyState from '../common/EmptyState'
import Button from '../common/Button'

export default function Placeholder() {
  const { pathname } = useLocation()

  return (
    <div className="min-h-svh">
      <Navbar />
      <PageContainer>
        <EmptyState
          icon={Construction}
          title="This screen is on the roadmap"
          description={`The route “${pathname}” is part of GlobeTrotter but will be built in an upcoming step. Auth, theming and the design system are ready.`}
          action={
            <Button to="/" variant="secondary">
              Back to Home
            </Button>
          }
        />
      </PageContainer>
    </div>
  )
}
