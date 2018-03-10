pragma solidity ^0.4.18;

import "github.com/Arachnid/solidity-stringutils/strings.sol";

contract C {
  using strings for *;
  string public s;

  function foo(string s1, string s2) public {
    s = s1.toSlice().concat(s2.toSlice());
  }
}

import "./TokenERC20.sol";
import "./RatingAgency.sol";

contract test2 {
    address defaultRa = 0x1390df34a12f2a8b16289d584c8785ada1f798bb;
    using strings for *;
    RatingAgency ratingAgency;
    mapping( uint => address ) tokens;
    uint num_tokens;

    uint16 cycle;
    uint time; 
    uint32 token;
    uint16 value;
    uint8 stat;
    address repr;
    uint8 num_analysts; 
    bytes32 avg_answer;
    uint8 r1_avg;
    uint8 r2_avg;
    uint8 sways;
    uint8 winner;

    
    event Log( string str, uint num1, uint num2 );
    function test2(address _ra) public {
        address ra = _ra == 0 ? defaultRa: _ra;
        ratingAgency = RatingAgency( ra );
    }
    
    function SetRatingAgency(address ra) public {
        ratingAgency = RatingAgency( ra );
        emit Log( "", ratingAgency.num_tokens(), ratingAgency.num_cycles()  );
    }
    /*
    function TokenERC20(
        uint256 initialSupply,
        string tokenName,
        string tokenSymbol
    */
    event TokenCreated( string name, string symbol, address addr );
    function bootstrapDummyTokens( uint8 _num ) public { 
        uint8 num = _num == 0 ? 4 : _num;
        uint start = num_tokens;
        uint finish = num_tokens+num;
        string memory basename = "MOOLAH_";
        string memory basesymbol = "MOO";
        for ( uint i = start; i < finish; i++ ) {
            string memory name = basename.toSlice().concat(uint2str(num_tokens).toSlice());
            string memory symbol = basesymbol.toSlice().concat(uint2str(num_tokens).toSlice());
            address token = new TokenERC20( 10000, name, symbol );
            tokens[ num_tokens++ ] = token;
            emit TokenCreated( name, symbol, token );
            ratingAgency.coverToken( token, 0 );
        }
    }
    
    event RoundInfo(
        uint16 cycle,
        uint time, 
        uint32 token,
        uint16 value,
        uint8 stat,
        address repr,
        uint8 num_analysts, 
        bytes32 avg_answer,
        uint8 r1_avg,
        uint8 r2_avg,
        uint8 sways,
        uint8 winner
    );
    
    event RoundSummary(
        uint16 round, 
        uint8 num_analysts,
        bytes32 avg_answer,
        uint8 r1_avg,
        uint8 r2_avg,
        uint8 sways,
        uint8 winner
    );
    //event TokenInfo( uint32 token_id, address token_addr, string token_name, string token_symbol );
    function bootstrapRound( uint16 _cycle, uint32 _token ) public {
        //address token_addr;
        ratingAgency.generateAvailabilities( _cycle );
        ratingAgency.initiateRound( _cycle, _token );
        uint16 round = ratingAgency.num_rounds() - 1;  
        emit Log('got round',cycle, round);
        ( cycle, token, value, stat, num_analysts) = ratingAgency.roundInfo( round ); 
        /* generate surveys */
        
        
        // ratingAgency.tallyRound( round );
        ( avg_answer, r1_avg, r2_avg, sways, winner ) = ratingAgency.roundSummary( round );
        emit RoundSummary( round, num_analysts, avg_answer, r1_avg, r2_avg, sways, winner );
        //( token, token_addr ) = ratingAgency.coveredTokenInfo( token );
        //TokenERC20 tokenContract = TokenERC20( token_addr );
        //emit TokenInfo( token, token_addr, tokenContract.name(), tokenContract.symbol() );        
        // generate surveys and submit them
        
    }
    
    function coverToken( uint i ) public {
        address token = tokens[ i ];
        ratingAgency.coverToken( token, 0 );
    }
    function uint2str(uint i) internal pure returns (string){
        if (i == 0) return "0";
        uint j = i;
        uint length;
        while (j != 0){
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint k = length - 1;
        while (i != 0){
            bstr[k--] = byte(48 + i % 10);
            i /= 10;
        }
        return string(bstr);
    }
}

contract test1 {
    
    struct RoundSurvey {// Round evaluations
        bytes32 answers;  
        byte qualitatives; // yes / no
        uint8 recommendation; // 1-10
        bytes32 comment;
    }
    mapping ( uint8 => RoundSurvey[2] ) evaluations; 
    struct RoundAssessment {
        bytes32 avg_answer;
        uint8 avg_recommendation;
        uint8 sways;
    }
    struct Round {
        mapping ( uint8 => RoundSurvey ) evaluations;  
    }
    
    mapping ( uint16 => Round ) rounds;
    function test(address _ratingAgency) public {

        rounds[0] = Round();  
        rounds[1] = Round();
    }
    
    
    function submitSurvey(uint16 _round, bool _pre, bytes32 _answers, byte _qualitatives, uint8 recommendation, bytes32 comment) {
    
    
    }
    
    
    event showbyte(byte b);
    function bytesToBytes32(bytes b, uint offset) public returns (bytes32) {
        bytes32 out;

        for (uint i = 0; i < 32; i++) {
            emit showbyte(b[offset+i]);
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }
    
    function bytes32toUints(bytes32 b) public pure returns (uint8[32] result){
        for (uint i=0; i< 32; i++){
            result[i] = uint8(b[i]);
        }
    }

}

