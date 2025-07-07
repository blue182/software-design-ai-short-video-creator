// remotion/Composition.jsx
import { Composition } from 'remotion';
import RemotionComposition from '../app/editor/_components/RemotionComposition'; // Đường dẫn cần đúng

export const MyComposition = () => {
    return (
        <Composition
            id="RemotionComposition"
            component={RemotionComposition}
            durationInFrames={300} // giá trị mặc định thôi, sẽ override khi render
            fps={30}
            width={1080}
            height={1920}
            defaultProps={{
                frameList: [], // bạn có thể gán frameList mẫu ở đây nếu test thủ công
            }}
        />
    );
};
