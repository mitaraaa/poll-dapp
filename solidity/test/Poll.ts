import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { EventLog } from "ethers";
import { ethers } from "hardhat";
import { Poll } from "../typechain-types/Poll";

interface Option {
    id: bigint;
    name: string;
    voteCount: bigint;
}

describe("Poll", () => {
    const deployPollFixture = async () => {
        const [owner, otherAccount] = await ethers.getSigners();

        const Poll = await ethers.getContractFactory("Poll");

        const contract: Poll = await Poll.deploy("testName", [
            "option1",
            "option2",
        ]);

        return { contract, owner, otherAccount };
    };

    describe("Deployment", () => {
        it("Should return all options", async () => {
            const { contract } = await loadFixture(deployPollFixture);

            const optionStructs = await contract.getOptions();
            const options = optionStructs.map((option) => {
                return <Option>{
                    id: option[0],
                    name: option[1],
                    voteCount: option[2],
                };
            });

            expect(options).to.have.deep.members([
                <Option>{
                    id: 0n,
                    name: "option1",
                    voteCount: 0n,
                },
                <Option>{
                    id: 1n,
                    name: "option2",
                    voteCount: 0n,
                },
            ]);
        });

        it("Should cast a vote", async () => {
            const { contract, otherAccount } = await loadFixture(
                deployPollFixture
            );

            const tx = await contract.connect(otherAccount).castVote(0);
            const rc = await tx.wait();

            const event = rc?.logs.find(
                (log): log is EventLog =>
                    log instanceof EventLog && log.fragment.name === "VoteCast"
            );
            const eventArgs = [...event?.args!];

            expect(eventArgs).to.have.deep.members([0n, "option1", 1n]);
        });

        it("Should return the name of the poll", async () => {
            const { contract } = await loadFixture(deployPollFixture);

            expect(await contract.getName()).to.equal("testName");
        });

        it("Should prevent double voting", async () => {
            const { contract, otherAccount } = await loadFixture(
                deployPollFixture
            );

            await contract.connect(otherAccount).castVote(0);

            await expect(contract.connect(otherAccount).castVote(0)).to.be
                .reverted;
        });

        it("Should prevent voting for non-existing option", async () => {
            const { contract, otherAccount } = await loadFixture(
                deployPollFixture
            );

            await expect(contract.connect(otherAccount).castVote(2)).to.be
                .reverted;
        });

        it("Should prevent voting on closed poll", async () => {
            const { contract, owner, otherAccount } = await loadFixture(
                deployPollFixture
            );

            await contract.connect(otherAccount).castVote(0);

            await contract.connect(owner).closePoll();

            await expect(contract.connect(otherAccount).castVote(1)).to.be
                .reverted;
        });

        it("Should return total amount of votes", async () => {
            const { contract, otherAccount } = await loadFixture(
                deployPollFixture
            );

            await contract.connect(otherAccount).castVote(0);

            expect(await contract.getTotalVotes()).to.equal(1);
        });

        it("Should return the winner", async () => {
            const { contract, owner, otherAccount } = await loadFixture(
                deployPollFixture
            );

            await contract.connect(otherAccount).castVote(0);

            await contract.connect(owner).closePoll();

            expect([
                ...(await contract.connect(otherAccount).getWinner()),
            ]).to.have.deep.members([0n, "option1", 1n]);
        });

        it("Should return poll status", async () => {
            const { contract, owner } = await loadFixture(deployPollFixture);

            expect(await contract.isClosed()).to.equal(false);

            await contract.connect(owner).closePoll();

            expect(await contract.isClosed()).to.equal(true);
        });

        it("Should return owner's address", async () => {
            const { contract, owner } = await loadFixture(deployPollFixture);

            expect(await contract.getOwner()).to.equal(owner.address);
        });

        it("Check if given address already voted", async () => {
            const { contract, otherAccount } = await loadFixture(
                deployPollFixture
            );

            await contract.connect(otherAccount).castVote(0);

            expect(await contract.connect(otherAccount).hasVoted()).to.equal(
                true
            );
        });
    });
});
