import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';

interface QuestionItem {
  id: string;
  question: string;
  answer: string;
}

interface QuestionsAccordionProps {
  items?: QuestionItem[];
}

const faqItems = [
  {
    id: 'faq-1',
    question: 'What is Ducket?',
    answer:
      'Ducket is a platform that allows you to store, share and collaborate on files. It is a simple and easy to use platform that is perfect for personal and business use. In addition, we offer you a public API to use it in your own project.',
  },
  {
    id: 'faq-2',
    question: 'How can I use the API?',
    answer:
      'Our API is developed with the DX as a reference. You can find the documentation in the header navigation on "Developers" section.',
  },
  {
    id: 'faq-3',
    question: 'What I need to create an account?',
    answer:
      'You need to create an account to use Ducket. You only will need an email and a password to create an account or use your own Github account to login.',
  },
  {
    id: 'faq-4',
    question: 'Are my files private?',
    answer:
      "Ducket is a shareable file storage platform using a cloud CDN proxy. That means your files are public and can be accessed by anyone with the URL. You only need to share the files URL to allow others to access them. By now we don't offer a private storage option.",
  },
  {
    id: 'faq-5',
    question: 'What is the pricing policy?',
    answer:
      'We offer a free tier for all users during beta. After the beta, we will offer a free plan and a paid plan. The paid plan will have more features such as more storage, more file sizing and AI features.',
  },
];

const QuestionsAccordion = ({ items = faqItems }: QuestionsAccordionProps) => {
  return (
    <Accordion type="single" collapsible className="mx-auto w-full lg:max-w-3xl">
      {items.map(item => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60">
            <div className="font-medium sm:py-1 lg:py-2 lg:text-lg">{item.question}</div>
          </AccordionTrigger>
          <AccordionContent className="sm:mb-1 lg:mb-2">
            <div className="text-muted-foreground lg:text-lg">{item.answer}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export { QuestionsAccordion };
