import './SlidingBlock.css';

function SlidingBlock({ children }: any) {
    return (
        <div className='sliding-frame'>
            <div className='sliding-area'>
                <div className='sliding'>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default SlidingBlock;