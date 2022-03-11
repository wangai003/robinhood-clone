import './suggestionlist.css'
const SuggestionsList = ({filteredSuggestions,onSuggestion,activeSuggestionIndex}) => {
    return filteredSuggestions.length ? (
      <ul className="suggestions">
        {filteredSuggestions.map((suggestion, index) => {
          let className;
          // Flag the active suggestion with a class
          if (index === activeSuggestionIndex) {
            console.log(index)
            className = "suggestion-active";
          }
          return (
            <li className={className} key={suggestion} onClick={onSuggestion}>
              {suggestion}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className="no-suggestions">
        <em>No suggestions</em>
      </div>
    );
  };

  export default SuggestionsList
