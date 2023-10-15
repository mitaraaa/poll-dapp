// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

contract Poll {
    address private owner;
    string private name;
    uint256 private totalVotes;
    bool private isOpen;

    struct Option {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    Option[] public options;
    mapping(address => bool) public _hasVoted;

    event VoteCast(uint256 indexed id, string name, uint256 voteCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier openPoll() {
        require(isOpen == true, "Poll is closed");
        _;
    }

    modifier closedPoll() {
        require(isOpen == false, "Poll is open");
        _;
    }

    modifier validOptionId(uint256 _id) {
        require(
            _id >= 0 && _id < options.length,
            "Invalid vote option selected"
        );
        _;
    }

    modifier notVotedYet() {
        require(
            _hasVoted[msg.sender] == false,
            "You have already voted in this poll"
        );
        _;
    }

    function addVoteOption(string memory _name) public onlyOwner {
        options.push(Option(options.length, _name, 0));
    }

    constructor(string memory _name, string[] memory _options) {
        owner = msg.sender;
        name = _name;

        for (uint256 i = 0; i < _options.length; i++) {
            addVoteOption(_options[i]);
        }

        totalVotes = 0;
        isOpen = true;
    }

    function castVote(
        uint256 _id
    ) public notVotedYet openPoll validOptionId(_id) {
        options[_id].voteCount++;
        _hasVoted[msg.sender] = true;
        totalVotes++;

        emit VoteCast(_id, options[_id].name, options[_id].voteCount);
    }

    function closePoll() public onlyOwner {
        isOpen = false;
    }

    function getWinner() public view closedPoll returns (Option memory) {
        uint256 winningVoteCount = 0;
        uint256 winningVoteOptionId = 0;

        for (uint256 i = 0; i < options.length; i++) {
            if (options[i].voteCount > winningVoteCount) {
                winningVoteCount = options[i].voteCount;
                winningVoteOptionId = i;
            }
        }

        return options[winningVoteOptionId];
    }

    function isClosed() public view returns (bool) {
        return isOpen == false;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function hasVoted() public view returns (bool) {
        return _hasVoted[msg.sender];
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function getTotalVotes() public view returns (uint256) {
        return totalVotes;
    }

    function getOptions() public view returns (Option[] memory) {
        return options;
    }
}
