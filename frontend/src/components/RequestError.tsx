import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { motion } from 'framer-motion'
import { AlertDescription, Alert, AlertTitle } from './ui/alert';

interface RequestErrorProps {
    message?: string;
}

const RequestError: React.FC<RequestErrorProps> = ({ message }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert variant="destructive">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {message}
                </AlertDescription>
            </Alert>
        </motion.div>
    )
}

export default RequestError;