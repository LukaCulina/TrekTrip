import { useTranslation } from 'react-i18next';
import './TripComments.css';

const TripComments = ({ trip, newComment, setNewComment, handleCommentSubmit, isLoggedIn, commentUploadText}) => {
    const { t } = useTranslation();

    return (
        <div className="comments-section">
            <h2 className="commentSectionTitle">{t('trip.comments')}</h2>
            <ul className="commentsListContainer">
                {trip?.comments?.map(comment => (
                    <div className="singleCommentContainer" key={comment.id}>
                        <p className="commentDisplayUsername">{comment.user.username}</p>
                        <p>{comment.content} {comment.timeOfPosting}</p>
                    </div>
                ))}
            </ul>
            {isLoggedIn && (
                <div className="commentInputSection">
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button className='submitComment' onClick={handleCommentSubmit}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default TripComments;
