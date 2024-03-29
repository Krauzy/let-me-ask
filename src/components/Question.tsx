// Styles
import '../styles/question.scss'

// Nodes
import { ReactNode } from 'react'

// Tools
import cx from 'classnames'

type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    }
    children?: ReactNode;
    isAnswered?: boolean;
    isHighlighted?: boolean;
}

export function Question({
    content, 
    author, 
    isAnswered = false, 
    isHighlighted = false, 
    children
}: QuestionProps) {
    return(
       <div className={cx(
           'question',
           {
               answered: isAnswered
           },
           {
                highlighted: isHighlighted && !isAnswered
           })}>
           <p>{content}</p>
           <footer>
               <div className="user-info">
                   <img src={author.avatar} alt={author.name} />
                   <span>{author.name}</span>
               </div>
               <div>
                    {children}
               </div>
           </footer>
       </div> 
    );
}