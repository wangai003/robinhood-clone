import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchMenu = ({ input }) => {
  const stocks = Object.values(useSelector(state => state.stocks));
  const matches = stocks
    .filter(
      stock =>
        stock.symbol.toLowerCase().includes(input.toLowerCase()) ||
        stock.name.toLowerCase().includes(input.toLowerCase())
    )
    .slice(0, 6);

  if (!input) return null;

  return (
    <div className='searchMenu'>
      {console.log(matches)}
      {matches.length ? (
        matches.map((match, i) => {
          return (
            <Link className='result' key={i} to={`/stocks/${match.symbol}`}>
              <span className='stockSymbol'>{match.symbol}</span>
              <span className='stockName'>{match.name}</span>
            </Link>
          );
        })
      ) : (
        <p className='noResult'>We were unable to find any results for your search.</p>
      )}
    </div>
  );
};

export default SearchMenu;
