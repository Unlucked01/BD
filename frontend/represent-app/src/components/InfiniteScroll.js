import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

function InfiniteScrollList({ items, renderItem, loadMore, hasMore }) {
  return (
    <div style={{ height: '600px', overflow: 'auto' }}>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={hasMore}
        loader={<div key={0}>Загрузка...</div>}
        useWindow={false}
      >
        {items.map(renderItem)}
      </InfiniteScroll>
    </div>
  );
}

export default InfiniteScrollList;
