import { useAuth0 } from '@auth0/auth0-react';
import { FunctionComponent } from 'react';
import ReactTooltip from 'react-tooltip';
import { TUser } from '../Chat';
import styles from '../Chat.module.css';

const SeenNode: FunctionComponent<{ index: number; seenNode: TUser }> = ({
    index,
    seenNode,
}) => {
    return (
        <div
            className={styles['seen-node']}
            style={{
                marginLeft: index !== 0 ? -6 : 'initial',
                position: 'relative',
                zIndex: 3 - index,
            }}>
            <img src={seenNode.picture} alt={seenNode.username} />
        </div>
    );
};

const SeenContainer: FunctionComponent<{
    seens: TUser[];
    chatNodeIndex: number;
}> = ({ seens, chatNodeIndex }) => {
    const data = useAuth0();

    if (!data.user) {
        return <></>;
    }
    const newSeens = seens.filter(
        (item) => item.username !== data.user?.nickname,
    );
    return (
        <div className={styles['seen-container']}>
            {newSeens.length ? (
                newSeens.map(
                    (seenNode: TUser, index: number) =>
                        index <= 2 && (
                            <SeenNode
                                seenNode={seenNode}
                                index={index}
                                key={index}
                            />
                        ),
                )
            ) : (
                <></>
            )}
            {newSeens.length > 3 && (
                <span
                    data-tip={seens
                        .map((item: TUser) => item.username)
                        .join('<br/>')}
                    data-for={'node-seen-' + chatNodeIndex}
                    className='text-gray-500 text-sm'>
                    &nbsp;and others...
                </span>
            )}
            <ReactTooltip
                className='flex flex-col'
                multiline
                id={'node-seen-' + chatNodeIndex}
            />
        </div>
    );
};

export default SeenContainer;
