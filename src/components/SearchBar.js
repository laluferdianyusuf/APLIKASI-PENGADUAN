// SearchBar.js
import * as React from "react";
import { Searchbar } from "react-native-paper";

const SearchBar = ({ placeholder, onChangeText, value, style }) => {
  return (
    <Searchbar
      placeholder={placeholder}
      onChangeText={onChangeText}
      value={value}
      style={style}
    />
  );
};

export default SearchBar;
