import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SearchMenu = ({ input }) => {
  const stocks = Object.values(useSelector(state => state.stocks));

  if (!input) return null;

  const regex = new RegExp(input, 'gi');
  const matches = stocks
    .filter(stock => stock.symbol.match(regex) || stock.name.match(regex))
    .sort((a, b) => {
      const aNameIndex = a.name.indexOf(a.name.match(regex)?.[0]);
      const bNameIndex = b.name.indexOf(b.name.match(regex)?.[0]);
      const aSymbolIndex = a.symbol.indexOf(a.symbol.match(regex)?.[0]);
      const bSymbolIndex = b.symbol.indexOf(b.symbol.match(regex)?.[0]);

      const aOrder =
        aSymbolIndex > -1 && aNameIndex > -1
          ? Math.min(aSymbolIndex, aNameIndex)
          : Math.max(aSymbolIndex, aNameIndex);
      const bOrder =
        bSymbolIndex > -1 && bNameIndex > -1
          ? Math.min(bSymbolIndex, bNameIndex)
          : Math.max(bSymbolIndex, bNameIndex);

      return (
        aOrder - bOrder ||
        (bSymbolIndex > -1) - (aSymbolIndex > -1) ||
        aSymbolIndex - bSymbolIndex ||
        a.symbol.length - b.symbol.length ||
        (bNameIndex > -1) - (aNameIndex > -1) ||
        aNameIndex - bNameIndex
      );
    })
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
