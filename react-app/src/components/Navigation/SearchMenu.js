import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchMenu = ({ input }) => {
  const stocks = Object.values(useSelector(state => state.stocks));

  if (!input) return null;

  const regex = new RegExp(input, 'gi');
  const matches = stocks
    .filter(stock => stock.symbol.match(regex) || stock.name.match(regex))
    .slice(0, 6)
    .map(stock => {
      const { symbol, name } = stock;
      const symbolMatch = symbol.match(regex)?.[0];
      const symbolBefore = symbolMatch ? symbol.slice(0, symbol.indexOf(symbolMatch)) : symbol;
      const symbolAfter = symbolMatch
        ? symbol.slice(symbol.indexOf(symbolMatch) + symbolMatch.length)
        : undefined;
      const nameMatch = name.match(regex)?.[0];
      const nameBefore = nameMatch ? name.slice(0, name.indexOf(nameMatch)) : name;
      const nameAfter = nameMatch
        ? name.slice(name.indexOf(nameMatch) + nameMatch.length)
        : undefined;
      console.log(symbol);

      return {
        symbol,
        symbolBefore,
        symbolMatch,
        symbolAfter,
        nameBefore,
        nameMatch,
        nameAfter,
      };
    });
  console.log(matches);

  return (
    <div className='searchMenu'>
      {matches.length ? (
        matches.map((match, i) => {
          const {
            symbol,
            symbolBefore,
            symbolMatch,
            symbolAfter,
            nameBefore,
            nameMatch,
            nameAfter,
          } = match;
          return (
            <Link className='result' key={i} to={`/stocks/${symbol}`}>
              <span className='stockSymbol'>
                {symbolBefore && <span>{symbolBefore}</span>}
                {symbolMatch && <span className='colored'>{symbolMatch}</span>}
                {symbolAfter && <span>{symbolAfter}</span>}
              </span>
              <span className='stockName'>
                {nameBefore && <span>{nameBefore}</span>}
                {nameMatch && <span className='colored'>{nameMatch}</span>}
                {nameAfter && <span>{nameAfter}</span>}
              </span>
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
