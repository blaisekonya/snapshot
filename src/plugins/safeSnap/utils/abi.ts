import {
  FormatTypes,
  Fragment,
  FunctionFragment,
  Interface,
  ParamType
} from '@ethersproject/abi';
import { BigNumberish } from '@ethersproject/bignumber';
import memoize from 'lodash/memoize';
import { ERC20_ABI, ERC721_ABI, EXPLORER_API_URLS } from '../constants';
import { ABI } from '@/helpers/interfaces';

export function isArrayParameter(parameter: string): boolean {
  return ['tuple', 'array'].includes(parameter);
}

export function isStringArray(value: string): boolean {
  try {
    return Array.isArray(JSON.parse(value));
  } catch {
    return false;
  }
}

const fetchContractABI = memoize(
  async (url: string, contractAddress: string) => {
    const params = new URLSearchParams({
      module: 'contract',
      action: 'getAbi',
      address: contractAddress
    });

    const response = await fetch(`${url}?${params}`);

    if (!response.ok) {
      return { status: 0, result: '' };
    }

    return response.json();
  },
  (url, contractAddress) => `${url}_${contractAddress}`
);

export function parseMethodToABI(method: FunctionFragment) {
  return [method.format(FormatTypes.full)];
}

export async function getContractABI(
  network: string,
  contractAddress: string
): Promise<string> {
  const apiUrl = EXPLORER_API_URLS[network];

  if (!apiUrl) {
    console.error(`No explorer URL for network ${network}.`);
    return '';
  }

  try {
    const { result, status } = await fetchContractABI(apiUrl, contractAddress);

    if (status === '0') {
      return '';
    }

    return result;
  } catch (e) {
    console.error('Failed to retrieve ABI', e);
    return '';
  }
}

function isWriteFunction(method: FunctionFragment) {
  if (!method.stateMutability) return true;
  return !['view', 'pure'].includes(method.stateMutability);
}

export function getABIWriteFunctions(abi: string | Fragment[]) {
  const abiInterface = new Interface(abi);
  return (
    abiInterface.fragments
      // Return only contract's functions
      .filter(FunctionFragment.isFunctionFragment)
      .map(FunctionFragment.fromObject)
      // Return only write functions
      .filter(isWriteFunction)
      // Sort by name
      .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1))
  );
}

function extractMethodArgs(values: string[]) {
  return (param: ParamType, index) => {
    const value = values[index];
    if (isArrayParameter(param.baseType)) {
      return JSON.parse(value);
    }
    return value;
  };
}

export function getContractTransactionData(
  abi: string,
  method: FunctionFragment,
  values: string[]
) {
  const contractInterface = new Interface(abi);
  const parameterValues = method.inputs.map(extractMethodArgs(values));
  return contractInterface.encodeFunctionData(method, parameterValues);
}

export function getAbiFirstFunctionName(abi: ABI): string {
  const abiInterface = new Interface(abi);
  return abiInterface.fragments[0].name;
}

export function getERC20TokenTransferTransactionData(
  recipientAddress: string,
  amount: BigNumberish
): string {
  const contractInterface = new Interface(ERC20_ABI);
  return contractInterface.encodeFunctionData('transfer', [
    recipientAddress,
    amount
  ]);
}

export function getERC721TokenTransferTransactionData(
  fromAddress: string,
  recipientAddress: string,
  id: BigNumberish
): string {
  const contractInterface = new Interface(ERC721_ABI);
  return contractInterface.encodeFunctionData('safeTransferFrom', [
    fromAddress,
    recipientAddress,
    id
  ]);
}
