import React, { useEffect } from 'react';
import Prism from 'prismjs';

const contractCode = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

// This is a simplified example for educational purposes.
// It does NOT include all necessary security checks.

import "https://github.com/aave/aave-v3-core/blob/master/contracts/flashloan/interfaces/IPool.sol";
import "https://github.com/aave/aave-v3-core/blob/master/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashLoanArbitrage {
    address payable owner;
    IPool public immutable POOL;

    constructor(address _poolProvider) {
        owner = payable(msg.sender);
        POOL = IPool(IPoolAddressesProvider(_poolProvider).getPool());
    }

    // Main function called by the bot to request a flash loan
    function requestFlashLoan(address _token, uint256 _amount) external {
        address receiverAddress = address(this);
        bytes memory params = ""; // No params needed for this example
        uint16 referralCode = 0;

        POOL.flashLoanSimple(
            receiverAddress,
            _token,
            _amount,
            params,
            referralCode
        );
    }

    // This function receives the loan and must execute the logic
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool) {
        
        // --- ARBITRAGE LOGIC GOES HERE ---
        // 1. Swap asset on DEX A for another token
        // 2. Swap the new token back to original asset on DEX B
        // 3. Ensure we have enough 'asset' to cover the loan + premium
        
        uint256 amountToRepay = amount + premium;
        
        // Repay the loan to Aave
        IERC20(asset).approve(address(POOL), amountToRepay);

        return true;
    }

    // Allow owner to withdraw any profits
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    receive() external payable {}
}
`.trim();

const SmartContractPanel: React.FC = () => {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="overflow-auto bg-background rounded-md p-1">
      <pre className="text-xs">
        <code className="language-solidity">
          {contractCode}
        </code>
      </pre>
    </div>
  );
};

export default SmartContractPanel;